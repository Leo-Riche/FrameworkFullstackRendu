<?php

namespace App\Controller;

use App\Entity\Media;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\Exception\FileException;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class MediaController extends AbstractController
{
    #[Route('/api/upload', name: 'media_upload', methods: ['POST'])]
    public function upload(Request $request, EntityManagerInterface $em): Response
    {
        $imageFile = $request->files->get('file');
        $altText = $request->request->get('altText') ?? '';

        if (!$imageFile) {
            return $this->json(['error' => 'Aucun fichier reçu'], 400);
        }

        $filename = uniqid() . '.' . $imageFile->guessExtension();

        try {
            $imageFile->move(
                $this->getParameter('uploads_directory'),
                $filename
            );
        } catch (FileException $e) {
            return $this->json(['error' => 'Erreur lors de l’enregistrement du fichier'], 500);
        }

        $media = new Media();
        $media->setUrl('/uploads/' . $filename);
        $media->setAltText($altText);

        $em->persist($media);
        $em->flush();

        return $this->json([
            'id' => $media->getId(),
            'url' => $media->getUrl(),
            'altText' => $media->getAltText(),
        ], 201);
    }
}
